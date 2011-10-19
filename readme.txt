This is the new repo for the jQuery Mobile ThemeRoller tool.

Notes on PHP configs for hosted version of jQm ThemeRoller:

1. The php function call file_get_contents() is used in a few places. In order for this to work, the php configuration allow_url_fopen must be set to true.

2. When a user generates a share link, the theme.css file is hosted temporarily (The script that stores the files and generates the url also runs a cleanup script to ensure no files older than 30 days are on the server). There must enough space to accommodate many themes being stored here at once.

3. When a user clicks "Download ZIP" the server must be able to create the zip and its contents, as well as store it temporarily (again self-cleaning script keeps files only 15 seconds old) so it can be downloaded through the browser.
