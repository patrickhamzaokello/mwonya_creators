import { Button } from "@/components/ui/button";

export default function LoadingButton({pending}:{pending:boolean}){
    return (
        <Button disabled={pending}>
            {pending ? (
                <div className="flex items-center justify-center">
                    Loading...
                </div>
            ):(
                "Sign In now"
            )}
        </Button>
    )
}
