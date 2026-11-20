fn main() {
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("ios") {
        println!("cargo:rerun-if-changed=src/ios/orientation.mm");
        println!("cargo:rerun-if-changed=src/ios/safe_area.mm");
        cc::Build::new()
            .cpp(true)
            .file("src/ios/orientation.mm")
            .file("src/ios/safe_area.mm")
            .flag("-fobjc-arc")
            .compile("fall_orientation");
        println!("cargo:rustc-link-lib=framework=UIKit");
        println!("cargo:rustc-link-lib=framework=WebKit");
        println!("cargo:rustc-link-lib=framework=CoreGraphics");
    }
    tauri_build::build()
}
