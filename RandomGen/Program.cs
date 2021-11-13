using System.Security.Cryptography;
using System.Text;

namespace RandomGen
{
    class Program
    {
        private const string ALPHA_NUMERIC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        private const string SPECIAL = @"!#$%&'()*+,-./:;<=>?@[\]^_`{|}~";

        private static readonly Dictionary<string, string> _words = new();

        static void Main()
        {
            BuildDictionary();
            Console.WriteLine($"Random value: {GenerateValue()}");
            Console.WriteLine($"Random phrase: {GeneratePhrase()}");
            Console.WriteLine($"Random guid: {Guid.NewGuid()}");
        }

        private static string GenerateValue(int size = 64, bool includeSpecialCharacters = false)
        {
            if (size <= 0 || size > 2048)
            {
                throw new ArgumentException(nameof(size));
            }

            var allowed = ALPHA_NUMERIC;
            if (includeSpecialCharacters)
            {
                allowed = string.Concat(allowed, SPECIAL);
            }

            var chars = allowed.ToCharArray();

            var data = new byte[size];
            using (var crypto = RandomNumberGenerator.Create())
            {
                crypto.GetBytes(data);
            }

            var result = new StringBuilder(size);
            foreach (var b in data)
            {
                result.Append(chars[b % chars.Length]);
            }

            return result.ToString();
        }

        private static string GeneratePhrase(int count = 5)
        {
            if (count <= 0 || count >= _words.Count)
            {
                throw new ArgumentOutOfRangeException(nameof(count));
            }

            var items = new List<string>();

            for (var i = 0; i < count; i++)
            {
                var index = string.Empty;

                // Each word in the EFF dataset is indexed by a 5-digit number
                for (var j = 0; j < 5; j++)
                {
                    // And each digit in that index is in the [1,6] range
                    var value = Random.Shared.Next(1, 7);
                    index = string.Concat(index, value);
                }

                // At the end of the inner loop, index will be equal to something like "25661"
                // The word at that index is appended to the final result
                items.Add(_words[index]);
            }

            return string.Join(' ', items);
        }

        private static void BuildDictionary()
        {
            // https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt
            var lines = File.ReadAllLines("eff_large_wordlist.txt").Where(l => !string.IsNullOrEmpty(l));

            foreach (var line in lines)
            {
                var temp = line.Split('\t');
                var index = temp[0];
                var value = temp[1];

                _words[index] = value;
            }
        }
    }
}
