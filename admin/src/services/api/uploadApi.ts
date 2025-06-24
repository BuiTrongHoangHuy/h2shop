import axiosInstance from "./axiosInstance";

const uploadApi = {
    async uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data.imageUrl;
        } catch (error) {
            console.error('Image upload failed:', error);
            throw new Error('Image upload failed');
        }
    },
};

export default uploadApi; 