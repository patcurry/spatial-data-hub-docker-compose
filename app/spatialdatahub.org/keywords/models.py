from django.urls import reverse
from django.db import models
from django.utils.text import slugify

#from datasets.models import Dataset


class Keyword(models.Model):
    # keywords should be unique, and they should not be blank
    keyword = models.CharField(
        max_length=100, blank=True, null=True, unique=True)
#    datasets = models.ManyToManyField(Dataset, related_name='keywords')
    keyword_slug = models.SlugField(max_length=100, unique=True,
                                    blank=True, null=True)

    def __str__(self):
        return self.keyword

    def save(self, *args, **kwargs):
        self.keyword_slug = slugify(self.keyword)
        super(Keyword, self).save(*args, **kwargs)

    def get_absolute_url(self):
        kwargs = {"keyword_slug": self.keyword_slug}
        return reverse("keywords:keyword_detail", kwargs=kwargs)
