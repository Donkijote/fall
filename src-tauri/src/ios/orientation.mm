#import <UIKit/UIKit.h>

// Tao's iOS view controller exposes this setter. Check it at runtime so a
// future Tauri/Tao upgrade fails explicitly instead of leaving the route unlocked.
@protocol FallOrientationController
- (void)setSupportedInterfaceOrientations:(UIInterfaceOrientationMask)orientations;
@end

extern "C" int fall_set_orientation(void *view_controller, bool allow_portrait) {
  UIViewController *controller = (__bridge UIViewController *)view_controller;
  if (![controller respondsToSelector:@selector(setSupportedInterfaceOrientations:)]) {
    return 1;
  }
  UIWindowScene *scene = controller.view.window.windowScene;
  if (scene == nil) {
    return 2;
  }

  UIInterfaceOrientationMask mask = allow_portrait
      ? UIInterfaceOrientationMaskAllButUpsideDown
      : UIInterfaceOrientationMaskLandscape;
  [(id<FallOrientationController>)controller setSupportedInterfaceOrientations:mask];
  [controller setNeedsUpdateOfSupportedInterfaceOrientations];

  // Unlocking Login should preserve the current direction, not force portrait.
  // The controller mask continues to govern subsequent physical rotations.
  if (!allow_portrait) {
    UIWindowSceneGeometryPreferencesIOS *preferences =
        [[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:mask];
    [scene requestGeometryUpdateWithPreferences:preferences errorHandler:^(NSError *error) {
      NSLog(@"Fall could not request landscape: %@", error.localizedDescription);
    }];
  }
  return 0;
}
