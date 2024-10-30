<template>
    <div style="margin-top: 1.5rem">
        <mi-apps-router
            get-router-action="/v1/routes"
            create-router-action="/v1/routes"
            update-router-action="/v1/routes"
            delete-router-action="/v1/routes"
            check-router-name-exist-action="/v1/routes/name/check"
        />
    </div>
</template>