from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.test import Client
from django.test import TestCase
from django.urls import reverse

from accounts.forms import AccountForm
from accounts.models import Account

#from accounts.views import account_list
from accounts.views import AccountList

from accounts.views import account_detail
from accounts.views import account_update
from accounts.views import account_remove

from datasets.models import Dataset

User = get_user_model()

# this is all obsolete, new accounts are automatically created
# when new users are created, there should be tests for that
'''
class NewAccountViewTests(TestCase):

    def test_new_account_url_resolves(self):
        response = self.client.get("/new_account/")
        self.assertEqual(response.status_code, 200)

    def test_new_account_function_resolves(self):
        request = HttpRequest()
        response = new_account(request)
        self.assertEqual(response.status_code, 200)

    def test_new_account_view_uses_correct_template(self):
        response = self.client.get(
            reverse("accounts:new_account"))
        self.assertTemplateUsed(response,
                                template_name="accounts/new_account.html")
        self.assertTemplateUsed(response,
                                template_name="base.html")

    def test_dataset_new_account_view_url_title_is_correct(self):
        response = self.client.get(
            reverse("accounts:new_account"))
        self.assertIn("<title>ZMT | New Account</title>",
                      response.content.decode("utf-8"))

    def test_new_account_view_uses_AccountForm(self):
        response = self.client.get(
            reverse("accounts:new_account"))
        self.assertIsInstance(response.context["form"], AccountForm)

    def test_new_account_view_redirects_to_account_detail_view_on_save(self):
        response = self.client.post(
            reverse("accounts:new_account"),
            data={"user": "test_user", "affiliation": "zmt"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"], "/test_user/")
'''


class AccountListViewTests(TestCase):

    def setUp(self):
        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

    def test_account_list_url_resolves_to_account_list_view(self):
        response = self.client.get("/accounts/")
        self.assertEqual(response.status_code, 200)

    def test_account_list_view_title_is_correct(self):
        response = self.client.get(
            reverse("accounts:account_list"))
        self.assertIn("<title>ZMT | Accounts</title>",
                      response.content.decode("utf-8"))

    def test_account_list_shows_accounts_on_page(self):
        response = self.client.get(
            reverse("accounts:account_list"))
        self.assertIn("test_user", response.content.decode("utf-8"))


class AccountDetailViewTests_NO_DATASETS(TestCase):

    def setUp(self):
        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

    def test_account_detail_view_without_datasets_says_none_available(self):
        response = self.client.get(
            reverse(
                "accounts:account_detail",
                kwargs={"account_slug": self.a1.account_slug}))
        self.assertIn('No datasets available. Clear Search.',
                      response.content.decode('utf-8'))

    def test_account_detail_view_brings_correct_number_dataset_objects(self):
        response = self.client.get(
            reverse(
                "accounts:account_detail",
                kwargs={"account_slug": self.a1.account_slug}))
        self.assertEqual(0, len(response.context['dataset_list']))


class AccountDetailViewTests(TestCase):

    def setUp(self):
        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

        self.ds1 = Dataset.objects.create(
            account=self.a1,
            author="Google",
            title="Google GeoJSON Example",
            description="Polygons spelling 'GOOGLE' over Australia",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

        self.ds3 = Dataset.objects.create(
            account=self.a1,
            author="Pat",
            title="Bienvenidos",
            description="Polygons spelling 'Bienvenidos'" +
                        " over the United States",
            url="https://raw.githubusercontent.com/zmtdummy/" +
                "GeoJsonData/master/bienvenidos.json",
            public_access=True)

    def test_account_detail_url_resolves_to_account_detail_view(self):
        response = self.client.get("/test_user/")
        self.assertEqual(response.status_code, 200)

    def test_account_detail_view_title_is_correct(self):
        response = self.client.get(
            reverse("accounts:account_detail",
                    kwargs={"account_slug": self.a1.account_slug}))
        self.assertIn("<title>ZMT | {0}</title>".format(self.a1.user),
                      response.content.decode("utf-8"))

    def test_account_detail_search_function_1(self):
        response = self.client.get("/test_user/?q=Bien")
        self.assertEqual(response.status_code, 200)
        self.assertIn('Bienvenidos', response.content.decode('utf-8'))
        self.assertNotIn('Google GeoJSON Example',
                         response.content.decode('utf-8'))


class AccountUpdateViewTests(TestCase):

    def setUp(self):
        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

        # pretty much login u1
        self.logged_in = Client()
        self.logged_in.login(username="test_user", password="test_password")
        self.logged_in.is_authenticated = True
        self.logged_in.id = self.u1.id

        # make non logged in client
        self.not_logged_in = Client()

    def test_account_update_url_resolves_to_account_update_view_for_logged_in_user(self):
        response = self.logged_in.get("/test_user/update/")
        self.assertEqual(response.status_code, 200)

    def test_account_update_url_redirects_for_non_logged_in_user(self):
        response = self.not_logged_in.get("/test_user/update/")
        self.assertEqual(response.status_code, 302)

    def test_account_update_view_title_is_correct(self):
        response = self.logged_in.get(
            reverse(
                "accounts:account_update",
                kwargs={"account_slug": self.a1.account_slug}))
        self.assertIn("<title>ZMT | Update {}</title>".format(self.a1.user),
                      response.content.decode("utf-8"))

    def test_account_update_view_uses_AccountForm(self):
        response = self.logged_in.get(
            reverse(
                "accounts:account_update",
                kwargs={"account_slug": self.a1.account_slug}))
        self.assertIsInstance(response.context["form"], AccountForm)

    def test_account_update_view_redirect_to_account_detail_view_on_save(self):
        response = self.logged_in.post(
            reverse(
                "accounts:account_update",
                kwargs={"account_slug": self.a1.account_slug}),
            data={"affiliation": "ZMT"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"], "/test_user/")

    def test_account_update_view_updates_account_data(self):
      # User name cannot be changed from this view. Only affiliation
        self.logged_in.post(
            reverse(
                "accounts:account_update",
                kwargs={"account_slug": self.a1.account_slug}),
            data={"affiliation": "University of Hawaii"},
            follow=True)

        response = self.logged_in.get("/test_user/update/")
        self.assertIn("University of Hawaii", response.content.decode("utf-8"))



class AccountRemoveViewTests(TestCase):

    def setUp(self):
        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

        # pretty much login u1
        self.logged_in = Client()
        self.logged_in.login(username="test_user", password="test_password")
        self.logged_in.is_authenticated = True
        self.logged_in.id = self.u1.id

        # make non logged in client
        self.not_logged_in = Client()

    def test_account_remove_url_resolves_to_account_remove_view(self):
        response = self.logged_in.get("/"+self.a1.account_slug+"/remove/")
        self.assertEqual(response.status_code, 200)

    def test_account_remove_url_redirects_non_logged_in_user(self):
        response = self.not_logged_in.get("/"+self.a1.account_slug+"/remove/")
        self.assertEqual(response.status_code, 302)

    def test_dataset_account_remove_view_url_title_is_correct(self):
        response = self.logged_in.get(
            reverse(
                "accounts:account_remove",
                kwargs={"account_slug": self.a1.account_slug}))
        self.assertIn("<title>ZMT | Remove Account</title>",
                      response.content.decode("utf-8"))

    def test_account_remove_view_redirects_to_portal_view_on_save(self):
        response = self.logged_in.post(
            reverse(
                "accounts:account_remove",
                kwargs={"account_slug": self.a1.account_slug}))
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"], "/")

    def test_account_remove_view_removes_account_data(self):
        self.logged_in.post(reverse(
             "accounts:account_remove",
             kwargs={"account_slug": self.a1.account_slug}))
        self.assertFalse(Account.objects.all())

