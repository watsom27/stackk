use rocket::{http::Status, post, routes, Route};

pub fn routes() -> impl Into<Vec<Route>> {
    routes![health_check]
}

/// Returns 204 if the server is up and running
/// Healthcheck command: curl -X POST -k <url>
#[post("/")]
fn health_check() -> Status {
    Status::NoContent
}
