import React from 'react'
import Typewriter from 'typewriter-effect';
import Thinking from './Thinking.gif'
import './loadingPage.css'
export default function LoadingPage() {
  return (
    <div className='loadingPageWrapper'>
        <h1>Thinking</h1>
        <div>
        <img src={Thinking} alt='thinking gif' id='loadingGif'/>
            <Typewriter
            options={{
                strings: ['Give Us A Moment While We Look Over The Property', 'This May Take Up To A Minute'],
                autoStart: true,
                loop: true,
            }}
            />
        </div>
    </div>
  )
}
