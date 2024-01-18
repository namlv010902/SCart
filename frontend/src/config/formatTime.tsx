export const formatTime = (data: any) => {
    return new Date(data?.createdAt).toLocaleDateString()
}