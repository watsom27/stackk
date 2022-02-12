use std::{env, fs, io, path::PathBuf};

use rocket::{error, fs::relative, warn};

pub fn set_env_from_file() -> io::Result<()> {
    let root = relative!("");
    let path = {
        let mut path = PathBuf::with_capacity(root.len() + 4);

        path.push(root);
        path.push(".env");
        path
    };

    match fs::read_to_string(&path) {
        Ok(contents) => {
            for line in contents.lines() {
                let mut parts = line.split('=');

                let key = parts.next();
                let value = parts.next();

                if let (Some(key), Some(value)) = (key, value) {
                    // TODO:
                    // Not sure if this should override command line env variables or other way
                    // around.
                    env::set_var(key, value);
                } else {
                    // TODO:
                    // Report line number and part that is complete.
                    warn!("Incomplete .env entry");
                }
            }
        },

        Err(error) => error!("{}", error),
    }

    Ok(())
}
