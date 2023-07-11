export namespace file {
	
	export class FileInfo {
	    name: string;
	    path: string;
	    modTime: string;
	    isDir: boolean;
	    size: number;
	
	    static createFrom(source: any = {}) {
	        return new FileInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.modTime = source["modTime"];
	        this.isDir = source["isDir"];
	        this.size = source["size"];
	    }
	}

}

