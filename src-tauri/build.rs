fn main() {
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("ios") {
        println!("cargo:rerun-if-changed=src/ios/orientation.mm");
        cc::Build::new()
            .cpp(true)
            .file("src/ios/orientation.mm")
            .flag("-fobjc-arc")
            .compile("fall_orientation");
        println!("cargo:rustc-link-lib=framework=UIKit");
    }
    tauri_build::build()
}
