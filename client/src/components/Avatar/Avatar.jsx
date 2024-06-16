import React from 'react'

const Avatar = ({children,backgroundColor,px,py,color,borderRadius,frontSize,cursor}) => {
    const style={
        backgroundColor,
        padding : `${py} ${px}`,
        color : color || 'black',
        borderRadius,
        frontSize,
        textAlign: "center",
        cursor: cursor || null
    }
  return (
    <div style={style}>
       {children}
    </div>
  )
}

export default Avatar
