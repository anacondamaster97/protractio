import './box-loading.css'

const BoxLoading = () => {
    return (
        /* From Uiverse.io by AqFox */ 
        <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
} // #004dff
// rgba(0,77,255,0.2);

const LoadingBoxMiddle = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <BoxLoading />
        </div>
    )
}

export default LoadingBoxMiddle;