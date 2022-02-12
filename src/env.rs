use std::env::{self, VarError};

pub struct EnvState {
    pub public_dir: String,
}

impl EnvState {
    /// Reads the environment variables
    pub fn new() -> Result<Self, VarError> {
        env::var("PUBLIC_DIR").map(|public_dir| Self { public_dir })
    }
}
