use std::path::PathBuf;

use rocket::{
    fs::{relative, NamedFile},
    get,
    routes,
    Route,
    State,
};

use crate::env::EnvState;

pub fn routes() -> impl Into<Vec<Route>> {
    routes![public_files]
}

/// Checks to see if the passed path exists in the /public/ directory and falls back to /index.html
/// if not
#[get("/<asset_path..>")]
async fn public_files(asset_path: PathBuf, env: &State<EnvState>) -> Option<NamedFile> {
    let root = relative!("");
    let public = &env.public_dir;

    let mut path = PathBuf::with_capacity(root.len() + public.len() + asset_path.as_os_str().len());

    path.push(public);
    path.push(asset_path);

    if path.exists() {
        if path.is_dir() {
            path.push("index.html")
        }
    } else {
        path.clear();
        path.push(public);
        path.push("index.html");
    }

    let file = NamedFile::open(&path).await;

    file.ok()
}
