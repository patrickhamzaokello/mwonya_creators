import React from "react";
import {useQuery} from "@tanstack/react-query";

type DataLoaderProps = {
    url: string;
    params?: Record<string, string>;
    children: (data: any) => React.ReactNode;
};


export const DataLoader = ({
    url,
    params,
    children = () => null,
}:  DataLoaderProps)=> {
    const {data, error, isLoading } = useQuery({
        queryKey: [url, params],
        queryFn: async () => {
            const response = await fetch(url + new URLSearchParams(params));
            if (!response.ok){
                throw new Error("Network Error");
            }
            return response.json();
        },
    });

    if(isLoading){
        return <div> Loading...</div>;
    }

    if(error){
        return <div> Error: {error.message}</div>
    }

    return children(data)
}