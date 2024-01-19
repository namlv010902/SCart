import { Steps } from 'antd'
import React from 'react'

const Step = (props:any) => {
    const number = props.number
  return (
    <div>
        <Steps
              size="small"
              current={number}
              items={[
                {
                  title: 'Shopping cart',
                },
                {
                  title: 'Checkout',
                },
                {
                  title: 'Complete',
                },
              ]}
            />
    </div>
  )
}

export default Step