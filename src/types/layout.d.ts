import { MiComponent, MiProps } from './component'

export declare class Layout extends MiComponent {
    $props: MiProps & {

        /**
         * Whether to embed in other systems.
         * If true, the left menu and header are hidden.
         * @type boolean
         */
        embed?: boolean;

        /**
         * Custom class name in `sider`
         * @type string
         */
        siderClassName?: string;

        /**
         * Custom class name in `left menu`
         * @type string
         */
        menuClassName?: string;
    }
}