export default function imageValidator(e) {
    let files = e.target.files
    console.log(files)
    if (files.length === 0)
        return "Pic is Mendatory"
    else if (files.length === 1) {
        let file = files[0]
        if (file.size > 2048576)
            return "Pic size is too High.Please Upload image up to 1MB"
        else if (!(file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'))
            return "Invalid Pic Format. Please Upload and Image of Type .png,.jpg,.jpeg,.gif"
        else
            return ""
    }
    else {
        let errorMessage = []
        Array.from(files).forEach((x,index)=>{
            if(x.size>2048576)
                return errorMessage.push(`Pic ${index+1} Size Is Too High.Please Upload Image Upto 1MB`)
            else if (!(x.type==='image/jpg'||x.type==='image/jpeg'||x.type==='image/png'||x.type==='image/gif'))
                return errorMessage.push(`Invalid Pic ${index+1} Format. Please Upload and Image of Type .png,.jpg,.jpeg,.gif`)
        })
        return errorMessage.length===0?"":errorMessage
    }
}
