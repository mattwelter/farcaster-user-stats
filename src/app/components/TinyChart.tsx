'use client'

import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default async function App(fid: any) {

    const rawData = fid.fid[0]
    const data = []

    for (const [key, value] of Object.entries(rawData)) {
        var daysAgo = key.replace("day", "")
        var x = new Date().getDate()
        var date = new Date().setDate(x - parseInt(daysAgo))
        console.log({ date })

        var day = new Date(date).getDate()
        var month = new Date(date).getMonth() + 1

        data.push({
            name: month + "/" + day,
            followers: parseInt(value as string),
        })
      }

    console.log(data)

    return (
            <LineChart width={500} height={100} data={data}>
                <Line type="monotone" dataKey="followers" stroke="#8884d8" strokeWidth={1} />
                {/* <XAxis dataKey="name" angle={90}/> */}
            </LineChart>
    );
  }
  
