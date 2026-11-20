/// Mark the macOS overlay before React starts, without user-agent detection or
/// an asynchronous platform query that would shift the first rendered layout.
pub fn init<R: tauri::Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new("window-chrome")
        .js_init_script(
            "Object.defineProperty(window, '__FALL_MACOS_TITLEBAR__', { value: true });",
        )
        .build()
}
