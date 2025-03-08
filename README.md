# xlsxjoin - join Excel and CSV files

Static WEB and Node.js command line application for joining Excel and
CSV files. 

Download files and run locally or run directly from here:

[WEB xlsxjoin](https://midstar.github.io/xlsxjoin/xlsxjoin.html)

## Notes

- Column headings must match between files in order for xlsxjoin to
  understand that they are the "same"
- At least one column must have unique values and the corresponding
  column must be available in all Excel or CSV files. xlsxjoin will
  try to auto detect the key column.
- xlsxjoin will always use the first sheet in an Excel file

## Usage Static WEB version

- Open xlsxjoin.html
- Drag and drop all Excel and CSV files to join to the page
- Download result as Excel or CSV

## Usage Node.js version

    node xlsxjoin <file1> <file2> ... <fileN>

Result will be saved as output.xlsx


