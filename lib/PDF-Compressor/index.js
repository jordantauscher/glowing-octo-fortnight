import {exec} from "child_process"
import path from "path"

export default class Compressor {
    constructor(input_file_path, options={}){
        this.input_file_path = `"${input_file_path}"`
        this.output_file_dirname = options.output_file_dirname || "."
        this.output_file_name = options.output_file_name || "output.pdf"
        this.output_file_path = `"${this.output_file_dirname}/${this.output_file_name}"` || `${options.output_file_path}`
        this.pixel_resolution = options.pixel_resolution || 300
        this.compatibility_level = options.compatibility_level || 1.2
        this.overprint = options.overprint || "simulate"
        this.pdf_settings = options.pdf_settings || "ebook"
        this.embed_all_fonts = options.embed_all_fonts || "true"
        this.subset_fonts = options.subset_fonts || "true"
        this.auto_rotate_pages = options.auto_rotate_pages || "None"
        this.image_downsample_type = options.image_downsample_type || "Bicubic"
        this.image_resolution = options.image_resolution || 150
        this.printed = options.printed || "false"
    }

    async compress(){

        const script = path.join(path.dirname(import.meta.url.replace("file://", "")), path.join("bin", "compress.sh"))

        const cmd = `bash ${script} ${this.input_file_path} ${this.output_file_path} ${this.pixel_resolution} ${this.compatibility_level} ${this.overprint} ${this.pdf_settings} ${this.embed_all_fonts} ${this.subset_fonts} ${this.auto_rotate_pages} ${this.image_downsample_type} ${this.image_resolution} ${this.printed}`
        
        try {
            return await new Promise((resolve, reject) => {
                exec(cmd, error => error ? reject(error) : resolve(this.output_file_path.replaceAll('"', "")));
            })
        } catch (error) {
            console.error(`Compression Script Error: ${error}`)
            throw error
        }
    }
}