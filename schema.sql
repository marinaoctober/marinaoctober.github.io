drop table if exists entries;
create table entries (
    title text primary key not null,
    'text' text not null
);
