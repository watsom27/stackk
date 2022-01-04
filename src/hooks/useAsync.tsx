import { useEffect, useState } from 'react';

interface DoneUseAsyncResult<T> {
    done: true,
    data: T,
}

interface NotDoneAsyncResult {
    done: false,
}

type UseAsyncResult<T> = DoneUseAsyncResult<T> | NotDoneAsyncResult;

export function useAsync<T>(callback: () => Promise<T>, ...dependencies: any[]): UseAsyncResult<T> {
    const [done, setDone] = useState<boolean>(false);
    const [data, setData] = useState<T>();

    useEffect(() => {
        setDone(false);

        callback().then((data: T) => {
            setData(data);
            setDone(true);
        });
    }, dependencies);

    return done
        ? {
            done: true,
            data: data!,
        }
        : {
            done: false,
        };
}
