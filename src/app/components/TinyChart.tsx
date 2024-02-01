'use client'

import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default async function App(fid: any) {

    const rawData = fid.fid
    const data = []

    for (let i=0; i<rawData.length; i++) {
        data.push({
            followers: parseInt(fid.fid[i] as string),
        })
      }

    console.log(data)

    return (
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="followers" stroke="#8884d8" strokeWidth={1} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
    );
  }
  
