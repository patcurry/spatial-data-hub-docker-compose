from django.conf.urls import url

from datasets import views

app_name = "datasets"

urlpatterns = [
    url(r"^new_dataset/$",
        views.new_dataset,
        name="new_dataset"),

    url(r"^(?P<dataset_slug>[-\w]*)/$",
        views.dataset_detail,
        name="dataset_detail"),

    url(r"^(?P<dataset_slug>[-\w]*)/embed/$",
        views.embed_dataset,
        name="embed_dataset"),

    url(r"^(?P<dataset_slug>[-\w]*)/sanity/$",
        views.sanity_dataset,
        name="sanity_dataset"),

    url(r"^(?P<dataset_slug>[-\w]*)/add_keyword/$",
        views.add_keyword_to_dataset,
        name="add_keyword_to_dataset"),

    url(r"^(?P<dataset_slug>[-\w]*)/remove_keyword/$",
        views.remove_keyword_from_dataset,
        name="remove_keyword_from_dataset"),

    url(r"^(?P<dataset_slug>[-\w]*)/update/$",
        views.dataset_update,
        name="dataset_update"),

    url(r"^(?P<dataset_slug>[-\w]*)/update/auth/$",
        views.dataset_update_auth,
        name="dataset_update_auth"),

    url(r"^(?P<dataset_slug>[-\w]*)/remove/$",
        views.dataset_remove,
        name="dataset_remove"),
]
