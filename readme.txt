This is the new repo for the jQuery Mobile ThemeRoller tool.

Notes on PHP configs for hosted version of jQm ThemeRoller:

1. The php function call file_get_contents() is used in a few places. In order for this to work, the php configuration allow_url_fopen must be set to true.

2. When a user generates a 'Share Theme' link, the theme.css file is hosted temporarily (The script that stores the files and generates the url also runs a cleanup script to ensure no files older than 30 days are on the server). There must be enough space to accommodate many themes being stored here at once.

3. When a user clicks "Download ZIP" the server must be able to create the zip and its contents, as well as store it temporarily (again self-cleaning script keeps files only 15 seconds old) so it can be downloaded through the browser.



License
==================

ThemeRoller code may used under the terms of either the MIT License or the GNU General Public License (GPL) Version 2. The MIT License is recommended for most projects. It is simple and easy to understand and it places almost no restrictions on what you can do with a jQuery project.

If the GPL suits your project better you are also free to use a jQuery project under that license.

You don’t have to do anything special to choose one license or the other and you don’t have to notify anyone which license you are using. You are free to use a jQuery project in commercial projects as long as the copyright header is left intact.

Note that the Farbtastic color picker used in this tool is licensed only under the GPL license. http://acko.net/dev/farbtastic
