## jQuery Mobile ThemeRoller

Notes on PHP configs for the hosted version:

* The PHP function call `file_get_contents()` is used in a few places. For this to work, the PHP configuration `allow_url_fopen` must be enabled (which it is by default).

* When a user clicks "Download ZIP" the server must be able to create the zip and its contents, as well as store it temporarily (again self-cleaning script keeps files only 15 seconds old) so it can be downloaded through the browser. This requires that PHP can create a writable "zips" folder in the root of the repository checkout. Alternatively, you can create one ahead of time. You can override this location via the `THEMEROLLER_ZIPDIR` environment variable.
