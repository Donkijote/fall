/// Route policy crosses the native boundary here; desktop/Android are unchanged.
#[tauri::command]
pub async fn set_orientation(
    _window: tauri::WebviewWindow,
    allow_portrait: bool,
) -> Result<(), String> {
    #[cfg(target_os = "ios")]
    {
        unsafe extern "C" {
            fn fall_set_orientation(
                view_controller: *mut std::ffi::c_void,
                allow_portrait: bool,
            ) -> std::ffi::c_int;
        }

        let (sender, mut receiver) = tauri::async_runtime::channel(1);
        // UIKit work must happen on the UI thread. Await its result without
        // blocking that thread, including when the app resumes from background.
        _window
            .with_webview(move |webview| {
                let result =
                    unsafe { fall_set_orientation(webview.view_controller(), allow_portrait) };
                let _ = sender.try_send(result);
            })
            .map_err(|error| error.to_string())?;
        match receiver.recv().await {
            Some(0) => Ok(()),
            Some(1) => Err("The iOS host does not support route orientation updates".into()),
            Some(_) => Err("The iOS window scene is not ready for orientation updates".into()),
            None => Err("The iOS orientation update was interrupted".into()),
        }
    }
    #[cfg(not(target_os = "ios"))]
    {
        let _ = allow_portrait;
        Ok(())
    }
}
