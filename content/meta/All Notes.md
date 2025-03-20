TABLE 
file.folder as "Folder", dateformat(date-modified,"MMM d, yyyy") as "Modified" 
FROM -"tags"
SORT date-modified DESC 
WHERE file.name != this.file.name AND file.name != "index" AND draft != "true"