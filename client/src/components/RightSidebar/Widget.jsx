import React from 'react'
import comment from '../../assest/comment-alt-solid.svg'
import pen from '../../assest/pen-solid.svg'
import blackLogo from '../../assest/blacklogo.svg'
const Widget = () => {
  return (
    <div className='widget'>
      <h4>The overflow blog</h4>
      <div className='right-sidebar-div-1'>
      <div className='right-sidebar-div-2'>
        <img src={pen} alt="pen" width='18' />
        <p>Observability is key to the future of software(and your DevOps career)</p>
      </div>
      <div className='right-sidebar-div-2' style={{marginLeft : "-6%"}}>
        <img src={pen} alt="pen" width='18' />
        <p style={{marginLeft : "-5%"}}>Podcast 374 :How valuable is your screen name?</p>
      </div>
      </div>
      <h4>Feature on Metag</h4>
      <div className='right-sidebar-div-1'>
      <div className='right-sidebar-div-2'>
        <img src={comment} alt="pen" width='18' style={{marginLeft : "-20%"}} />
        <p style={{marginLeft : "-19%"}}>Review queue workflows-Final release....</p>
      </div>
      <div className='right-sidebar-div-2'>
        <img src={comment} alt="pen" width='18' />
        <p>Please welcome Valued Associates: #958-V2Blast #959-SpencerG</p>
      </div>
      <div className='right-sidebar-div-2'>
        <img src={blackLogo} alt="pen" width='18' />
        <p>Outdated Answers : accepted answer is now unpinned on Stack Overflow</p>
      </div>
      </div>

      <h4>Hot Meta Posts</h4>
      <div className='right-sidebar-div-1'>
      <div className='right-sidebar-div-2'>
       <p>38</p>
        <p>Why was this spam flag declined,yet the question marked as spam?</p>
      </div>
      <div className='right-sidebar-div-2'>
       <p>20</p>
        <p>What is the best course of action when a user has high enough rep to...</p>
      </div>
      <div className='right-sidebar-div-2'>
        <p>14</p>
        <p>Is a link to the "How to ask" help page a useful comment?</p>
      </div>
      </div>
    </div>
  )
}

export default Widget
