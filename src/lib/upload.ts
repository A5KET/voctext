import axios from 'axios'


export async function uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    try {
        const response = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })

        return response.data.data

    } catch (error) {
        console.error(error)
    }
}
