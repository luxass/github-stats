import { useState } from "react";

type CollapsibleProps = {
    children: React.ReactNode;
};

export default function Collapsible({ children }: CollapsibleProps) {
    const [folded, setFolded] = useState<boolean>(false);
    return (
        <div>
            <button
                onClick={() => {
                    setFolded(!folded);
                    console.log(folded);
                }}
            >
                hey
            </button>
            {folded && (
                <div>
                    <h1>gg</h1>
                    {children}
                </div>
            )}
        </div>
    );
}
