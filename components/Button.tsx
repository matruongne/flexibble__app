import { MouseEventHandler, ReactNode } from 'react'
import Image from 'next/image'
type Props = {
	title: string
	leftIcon?: string | null
	rightIcon?: string | null
	handleClick?: MouseEventHandler
	isSubmitting?: boolean
	type?: 'button' | 'submit'
	bgColor?: string
	textColor?: string
}
const Button = ({
	title,
	leftIcon,
	rightIcon,
	handleClick,
	isSubmitting,
	type,
	bgColor,
	textColor,
}: Props) => {
	return (
		<button
			type={type || 'button'}
			disabled={isSubmitting}
			className={`flexCenter gap-3 py-3 px-4 ${
				isSubmitting ? 'bg-black/50' : bgColor || 'bg-primary-purple'
			} rounded-xl text-sm font-medium max-md:w-full
            ${textColor || 'text-white'}`}
			onClick={handleClick}
		>
			{leftIcon && (
				<Image src={leftIcon} className="object-contain" width={14} height={14} alt="left" />
			)}
			{title}
			{rightIcon && (
				<Image src={rightIcon} className="object-contain" width={14} height={14} alt="right" />
			)}
		</button>
	)
}

export default Button
