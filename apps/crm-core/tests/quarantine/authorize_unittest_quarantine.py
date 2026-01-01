import importlib.util
import pathlib
import unittest


_SRC = pathlib.Path(__file__).resolve().parents[1] / "src"
_AUTH_PATH = _SRC / "security" / "authorize.py"
_spec = importlib.util.spec_from_file_location("crm_core_security_authorize", _AUTH_PATH)
if _spec is None or _spec.loader is None:
    raise ImportError(f"Unable to load authorize module from {_AUTH_PATH}")
auth = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(auth)


class TestAuthorize(unittest.TestCase):
    def setUp(self) -> None:
        models = auth.models
        models.ROLES.clear()
        models.PERMISSIONS.clear()
        models.ROLE_PERMISSIONS.clear()
        models.PRINCIPAL_ROLES.clear()
        models.AUDIT_LOG.clear()

    def test_default_deny_when_no_roles(self):
        result = auth.authorize(principal_id="u1", action="read", resource="invoice")
        self.assertEqual(result["decision"], auth.Decision.DENY)
        self.assertEqual(result["matched"], [])
        self.assertTrue(auth.models.AUDIT_LOG)
        self.assertEqual(auth.models.AUDIT_LOG[-1].decision, "DENY")

    def test_allow_when_matching_allow_rule(self):
        models = auth.models
        models.add_role(models.Role(id="r_sales", name="sales_rep"))
        models.add_permission(models.Permission(id="p_invoice_read", resource="invoice", action="read"))
        models.assign_permission(role_id="r_sales", permission_id="p_invoice_read", effect="allow")
        models.assign_role(principal_id="u1", role_id="r_sales", scope=None)

        result = auth.authorize(principal_id="u1", action="read", resource="invoice", correlation_id="c1")
        self.assertEqual(result["decision"], auth.Decision.ALLOW)
        self.assertEqual(auth.models.AUDIT_LOG[-1].correlation_id, "c1")
        self.assertEqual(auth.models.AUDIT_LOG[-1].decision, "ALLOW")

    def test_deny_wins_over_allow(self):
        models = auth.models
        models.add_role(models.Role(id="r_admin", name="admin"))
        models.add_permission(models.Permission(id="p_any_read", resource="*", action="read"))
        models.add_permission(models.Permission(id="p_invoice_read", resource="invoice", action="read"))
        models.assign_permission(role_id="r_admin", permission_id="p_any_read", effect="allow")
        models.assign_permission(role_id="r_admin", permission_id="p_invoice_read", effect="deny")
        models.assign_role(principal_id="u1", role_id="r_admin", scope=None)

        result = auth.authorize(principal_id="u1", action="read", resource="invoice")
        self.assertEqual(result["decision"], auth.Decision.DENY)
        self.assertTrue(any(r["effect"].lower() == "deny" for r in result["matched"]))

    def test_wildcards_work(self):
        models = auth.models
        models.add_role(models.Role(id="r_ops", name="ops"))
        models.add_permission(models.Permission(id="p_invoice_any", resource="invoice", action="*"))
        models.assign_permission(role_id="r_ops", permission_id="p_invoice_any", effect="allow")
        models.assign_role(principal_id="u1", role_id="r_ops", scope=None)

        result = auth.authorize(principal_id="u1", action="approve", resource="invoice")
        self.assertEqual(result["decision"], auth.Decision.ALLOW)

    def test_scope_is_enforced(self):
        models = auth.models
        models.add_role(models.Role(id="r_tenant", name="tenant_role"))
        models.add_permission(models.Permission(id="p_invoice_read", resource="invoice", action="read"))
        models.assign_permission(role_id="r_tenant", permission_id="p_invoice_read", effect="allow")
        models.assign_role(principal_id="u1", role_id="r_tenant", scope="t1")

        allowed = auth.authorize(principal_id="u1", action="read", resource="invoice", scope="t1")
        denied = auth.authorize(principal_id="u1", action="read", resource="invoice", scope="t2")

        self.assertEqual(allowed["decision"], auth.Decision.ALLOW)
        self.assertEqual(denied["decision"], auth.Decision.DENY)


if __name__ == "__main__":
    unittest.main()
