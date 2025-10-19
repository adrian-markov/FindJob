import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from passlib.context import CryptContext

pwd_ctx = CryptContext(
    schemes=[
        'bcrypt', 'bcrypt_sha256', 'sha256_crypt', 'md5_crypt',
        'argon2', 'pbkdf2_sha256', 'pbkdf2_sha1'
    ],
    default='bcrypt',
    deprecated='auto',
    bcrypt__rounds=12,
)

load_dotenv('.env')

MYSQL_USER = os.getenv('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
MYSQL_HOST = os.getenv('MYSQL_HOST', '127.0.0.1')
MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')
MYSQL_DB = os.getenv('MYSQL_DB', 'job_board')

DB_URL = (
    f'mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}'
    f'@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}?charset=utf8mb4'
)

engine = create_engine(DB_URL, future=True)

def is_hashed(pw: str) -> bool:
    if not pw:
        return False
    return pwd_ctx.identify(pw) is not None

def main():
    print('Connexion à la DB:', DB_URL.split('?')[0])
    with engine.begin() as conn:
        rows = conn.execute(text('SELECT id_user, password FROM Users')).all()

        updated_plain = 0
        already_hashed = 0
        empty_or_null = 0

        for uid, pw in rows:
            if pw is None or pw == '':
                empty_or_null += 1
                continue

            if is_hashed(pw):
                already_hashed += 1
                continue

            new_hash = pwd_ctx.hash(pw)
            conn.execute(
                text('UPDATE Users SET password = :h WHERE id_user = :id'),
                {'h': new_hash, 'id': uid},
            )
            updated_plain += 1

        print(
            'Terminé — '
            f'{updated_plain} mot(s) de passe en clair migré(s) en bcrypt, '
            f'{already_hashed} déjà hashé(s) (inchangés), '
            f'{empty_or_null} vide(s)/NULL.'
        )

if __name__ == '__main__':
    main()
