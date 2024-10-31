<template>
    <div style="margin-top: 1.5rem">
        <mi-apps-menu
            get-menus-action="/v1/menus"
            create-menus-action="/v1/menus"
            update-menus-action="/v1/menus"
            delete-menus-action="/v1/menus"
            check-name-exist-action="/v1/menus/name/check"
        />
    </div>
</template>