#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

// Both WKWebView and its Tauri window can retain portrait insets after a
// native landscape request on a phone. A separate system-managed window in the
// same scene gets fresh insets. Only create that reference for this mismatch;
// never guess notch/home-indicator dimensions from a device model.
@class FallSafeAreaObserver;

@interface FallSafeAreaReferenceWindow : UIWindow
@property(nonatomic, weak) FallSafeAreaObserver *observer;
@end

@interface FallSafeAreaObserver : UIView
@property(nonatomic, weak) WKWebView *webView;
@property(nonatomic) UIEdgeInsets publishedInsets;
@property(nonatomic) BOOL hasPublishedInsets;
@property(nonatomic, strong) FallSafeAreaReferenceWindow *referenceWindow;
- (void)publishInsets:(BOOL)force;
@end

@implementation FallSafeAreaReferenceWindow
- (void)safeAreaInsetsDidChange {
  [super safeAreaInsetsDidChange];
  [self.observer publishInsets:NO];
}

- (void)layoutSubviews {
  [super layoutSubviews];
  [self.observer publishInsets:NO];
}
@end

@implementation FallSafeAreaObserver
- (void)dealloc {
  self.referenceWindow.hidden = YES;
}

- (void)didMoveToWindow {
  [super didMoveToWindow];
  [self publishInsets:NO];
}

- (void)safeAreaInsetsDidChange {
  [super safeAreaInsetsDidChange];
  [self publishInsets:NO];
}

- (void)layoutSubviews {
  [super layoutSubviews];
  [self publishInsets:NO];
}

- (void)publishInsets:(BOOL)force {
  WKWebView *webView = self.webView;
  UIWindow *window = webView.window;
  if (window == nil || CGRectIsEmpty(webView.bounds)) return;

  UIWindowScene *scene = window.windowScene;
  if (self.referenceWindow.windowScene != scene) {
    self.referenceWindow.hidden = YES;
    self.referenceWindow = nil;
  }
  UIEdgeInsets hostInsets = window.safeAreaInsets;
  BOOL stalePortraitInsets = window.traitCollection.userInterfaceIdiom == UIUserInterfaceIdiomPhone
      && UIInterfaceOrientationIsLandscape(scene.effectiveGeometry.interfaceOrientation)
      && CGRectGetWidth(window.bounds) > CGRectGetHeight(window.bounds)
      && hostInsets.top > 0 && hostInsets.left == 0 && hostInsets.right == 0;
  if (scene != nil && stalePortraitInsets && self.referenceWindow == nil) {
    FallSafeAreaReferenceWindow *reference =
        [[FallSafeAreaReferenceWindow alloc] initWithWindowScene:scene];
    self.referenceWindow = reference;
    reference.observer = self;
    reference.alpha = 0;
    reference.userInteractionEnabled = NO;
    reference.accessibilityElementsHidden = YES;
    reference.windowLevel = UIWindowLevelNormal - 1;
    reference.rootViewController = [[UIViewController alloc] init];
    // Hidden windows do not get a complete layout. This window is transparent,
    // below the game, and never made key; UIKit can still update its safe area.
    reference.hidden = NO;
    [reference layoutIfNeeded];
  }
  UIWindow *safeAreaWindow = self.referenceWindow ?: window;

  // Convert into web-view points: this also avoids double padding if the host
  // ever places the web view inside part of the native safe area.
  CGRect safeRect = [webView convertRect:safeAreaWindow.safeAreaLayoutGuide.layoutFrame fromView:safeAreaWindow];
  CGRect bounds = webView.bounds;
  UIEdgeInsets insets = UIEdgeInsetsMake(
      MAX(0, CGRectGetMinY(safeRect) - CGRectGetMinY(bounds)),
      MAX(0, CGRectGetMinX(safeRect) - CGRectGetMinX(bounds)),
      MAX(0, CGRectGetMaxY(bounds) - CGRectGetMaxY(safeRect)),
      MAX(0, CGRectGetMaxX(bounds) - CGRectGetMaxX(safeRect)));
  if (!force && self.hasPublishedInsets && UIEdgeInsetsEqualToEdgeInsets(insets, self.publishedInsets)) {
    return;
  }
  self.publishedInsets = insets;
  self.hasPublishedInsets = YES;

  NSString *script = [NSString stringWithFormat:
      @"(() => { const s = document.documentElement.style; "
       "s.setProperty('--native-safe-area-top', '%gpx'); "
       "s.setProperty('--native-safe-area-right', '%gpx'); "
       "s.setProperty('--native-safe-area-bottom', '%gpx'); "
       "s.setProperty('--native-safe-area-left', '%gpx'); })()",
      (double)insets.top, (double)insets.right, (double)insets.bottom, (double)insets.left];
  [webView evaluateJavaScript:script completionHandler:nil];
}
@end

extern "C" void fall_observe_safe_area(void *web_view) {
  WKWebView *webView = (__bridge WKWebView *)web_view;
  // A document reload reuses the web view. Reuse its observer and republish
  // even when the native insets have not changed since the previous document.
  for (UIView *child in webView.subviews) {
    if ([child isKindOfClass:FallSafeAreaObserver.class]) {
      [(FallSafeAreaObserver *)child publishInsets:YES];
      return;
    }
  }
  FallSafeAreaObserver *observer = [[FallSafeAreaObserver alloc] initWithFrame:webView.bounds];
  observer.webView = webView;
  observer.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  observer.userInteractionEnabled = NO;
  observer.accessibilityElementsHidden = YES;
  [webView addSubview:observer];
  [observer publishInsets:YES];
}
