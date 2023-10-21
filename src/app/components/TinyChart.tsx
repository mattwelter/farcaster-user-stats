'use client'

import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default async function App(fid: any) {

    const data = fid.fid

    return (
            <LineChart width={300} height={100} data={data}>
                <Line type="monotone" dataKey="followers" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
    );
  }
  
