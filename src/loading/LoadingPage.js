import React from 'react'
import Typewriter from 'typewriter-effect';
import './loadingPage.css'
export default function LoadingPage() {
  return (
    <div className='loadingPageWrapper'>
        <div>

        <Typewriter
        options={{
            strings: ['Give Us A Moment, While We Look Over The Property', 'This may take up to a minute'],
            autoStart: true,
            loop: true,
        }}
        />
        </div>
    </div>
  )
}
