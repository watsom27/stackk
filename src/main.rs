#[cfg(any(debug_assertions, feature = "dot_env"))]
mod dot_env;
mod env;
mod health;
mod public;

use env::EnvState;
use rocket::launch;

#[launch]
fn rocket() -> _ {
    #[cfg(any(debug_assertions, feature = "dot_env"))]
    dot_env::set_env_from_file().expect("Who changed the code without checking?");

    let env_state = EnvState::new().expect("You don't have any env setup, idiot.");

    rocket::build()
        .manage(env_state)
        .mount("/health", health::routes())
        .mount("/", public::routes())
}
