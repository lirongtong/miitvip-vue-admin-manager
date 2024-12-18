import { PropTypes } from '../../utils/types'

export interface ImageProperties {
    src: string
    alt?: string
}

export const ImageProps = () => ({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
})
