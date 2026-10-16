-- Test accounts for the account-mode e2e (fixed ids so the fake auth server can mint matching JWTs).
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'super@x.com'),
  ('00000000-0000-0000-0000-0000000000a2', 'analyst@x.com'),
  ('00000000-0000-0000-0000-0000000000a3', 'learner@x.com'),
  ('00000000-0000-0000-0000-0000000000a4', 'qm@x.com'),
  ('00000000-0000-0000-0000-0000000000a5', 'cm@x.com'),
  ('00000000-0000-0000-0000-0000000000a6', 'nobody-yet@x.com');
insert into public.admin_roles (user_id, email, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'super@x.com', 'super_admin'),
  ('00000000-0000-0000-0000-0000000000a2', 'analyst@x.com', 'analyst'),
  ('00000000-0000-0000-0000-0000000000a4', 'qm@x.com', 'question_manager'),
  ('00000000-0000-0000-0000-0000000000a5', 'cm@x.com', 'content_manager');
