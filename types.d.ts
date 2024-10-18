export interface FileWithLocation extends Express.Multer.File {
    location?: string
}
