import type React from "react"
import type { Control } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface SocialMediaLinksProps {
  control: Control<any>
  disabled?: boolean
}

export const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ control, disabled }) => {
  const socialPlatforms = [
    { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourusername" },
    { name: "twitter", label: "Twitter", placeholder: "https://twitter.com/yourusername" },
    { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
    { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/yourchannel" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Social Media Links</h3>
      {socialPlatforms.map((platform) => (
        <FormField
          key={platform.name}
          control={control}
          name={`socialLinks.${platform.name}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{platform.label}</FormLabel>
              <FormControl>
                <Input placeholder={platform.placeholder} {...field} disabled={disabled} />
              </FormControl>
              <FormDescription>Enter your {platform.label} profile URL (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}

