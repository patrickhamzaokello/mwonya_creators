import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from "react-icons/fa";
import { CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { socialBTN } from '@/actions/OAuth'

export const SocialProviders = () => {
    return (
        <CardFooter className="mt-6 p-0 flex items-center justify-center">
        <div className="flex gap-2">
        <Button
            size="lg"
            className="bg-base100 rounded-[5px] border-baseContent border-2 text-md text-baseContent"
            variant="outline"
            onClick={() => socialBTN('google')}
          >
            <FcGoogle className="mr-2" /> Google
          </Button>

          <Button
            size="lg"
            className="bg-base100 rounded-[5px] border-baseContent border-2 text-md text-baseContent"
            variant="outline"
            onClick={() => socialBTN('github')}
          >
            <FaGithub className="mr-2" /> <span>Github</span>
          </Button>
        </div>
      </CardFooter>
    )
}