
importClass(java.io.File);
importClass(java.io.FileWriter);

/**
 * @namespace Mozilla Rhino Utilities
 * @author Miller Medeiros
 * @version 0.1.2 (2010/09/13)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
millermedeiros.rhino = {

	/**
	 * Delete files recursivelly
	 * @param {java.io.File} folder
	 * @param {RegExp} [ignoreFilter]	Pattern of files that should be ignored.
	 * @param {boolean} [isSilent]	If it shouldn't output name of files deleted.
	 */
	purgeFolder : function(folder, ignoreFilter, isSilent){
		
		ignoreFilter = ignoreFilter || /^$/; //match empty string
		
		var 
			list = folder.listFiles(),
			current,
			n = list.length,
			success;
			
		while(n--){
			current = new File(list[n]);
			
			if(ignoreFilter.test(current)) continue; //skip if file match filter
			
			if(current.isFile()){
				success = current['delete']();
			}else if(current.isDirectory()){
				this.purgeFolder(current, ignoreFilter); //recursion
				if(! current.list().length){
					success = current['delete'](); //can only delete empty folder
				}
			}
			
			if(! isSilent){
				(success)? print('deleted: '+ current) : print('can\'t delete: '+ current);
			}
			
		}
	},
	
	/**
	 * Write data to a file.
	 * - will create file and parent directories if file/folders doesn't exist. 
	 * @param {java.io.File} file	File Object.
	 * @param {string} data
	 * @return {boolean} success.
	 */
	writeToFile : function(file, data){
		var tmpDir,
			writer,
			success;
		
		//create required dirs and file if it doesn't exist
		if(! file.exists()){
			tmpDir = file.getParentFile();
			if(! tmpDir.exists()) tmpDir.mkdirs();
			file.createNewFile();
		}
		
		writer = new FileWriter(file);
		success = writer.write(data);
		writer.close();
		
		return success;
	},
	
	/**
	 * Sanitize path slashes to system slashes
	 * @param {string} path
	 * @return {string}
	 */
	sanitizePath : function(path){
		return path.replace(/\/|\\/, File.separator);
	}
	
};
