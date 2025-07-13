"use client"

import React from 'react'
import { MonumentProps } from './base-monument'
import { Level1Monument } from './level-1-monument'
import { Level2Monument } from './level-2-monument'
import { Level3Monument } from './level-3-monument'
import { Level4Monument } from './level-4-monument'
import { Level5Monument } from './level-5-monument'

export const Monument: React.FC<MonumentProps> = (props) => {
    const { level } = props

    switch (level) {
        case 1:
            return <Level1Monument {...props} />
        case 2:
            return <Level2Monument {...props} />
        case 3:
            return <Level3Monument {...props} />
        case 4:
            return <Level4Monument {...props} />
        case 5:
            return <Level5Monument {...props} />
        default:
            return <Level1Monument {...props} />
    }
}

export default Monument 