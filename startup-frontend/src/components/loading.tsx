

export const Loading = () => {
    return (
        <div className="absolute inset-0 bg-white z-50 flex items-center justify-center"> 
          {/* Loading indicator */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-75"></div> 
        </div>
    )
}