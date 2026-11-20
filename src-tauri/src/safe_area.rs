/// Start native safe-area updates once the document is ready. UIKit owns the
/// observer's lifetime; browsers and other native platforms keep CSS env().
#[tauri::command]
pub async fn observe_safe_area(_window: tauri::WebviewWindow) -> Result<(), String> {
    #[cfg(target_os = "ios")]
    {
        unsafe extern "C" {
            fn fall_observe_safe_area(web_view: *mut std::ffi::c_void);
        }
        _window
            .with_webview(|webview| unsafe {
                fall_observe_safe_area(webview.inner());
            })
            .map_err(|error| error.to_string())?;
    }
    Ok(())
}
